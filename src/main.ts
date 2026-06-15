import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import flash from 'connect-flash';
import helmet from 'helmet';
import morgan from 'morgan';
import * as expressLayouts from 'express-ejs-layouts';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  // HTTP request logger
  app.use(morgan('dev'));

  // Static files: /public becomes accessible from browser
  app.useStaticAssets(join(process.cwd(), 'public'));

  // EJS view engine setup
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  // EJS layout setup
  app.use(expressLayouts);
  app.set('layout', 'layouts/main');

  // Global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // PostgreSQL session store
  const PgSession = connectPgSimple(session);

  app.use(
    session({
      store: new PgSession({
        conString: configService.get<string>('DATABASE_URL'),
        createTableIfMissing: true,
      }),
      secret: configService.get<string>('SESSION_SECRET') ?? 'fallback-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: Number(
          configService.get<string>('SESSION_MAX_AGE') ?? 86400000,
        ),
        httpOnly: true,
      },
    }),
  );

  // Flash message middleware
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);

  console.log(`\n🚀 Application running on: http://localhost:${port}`);
  console.log(
    `📋 Environment: ${configService.get<string>('NODE_ENV') ?? 'development'}\n`,
  );
}

bootstrap();
