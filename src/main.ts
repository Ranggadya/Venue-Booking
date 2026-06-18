import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import flash from 'connect-flash';
import * as passport from 'passport';
import helmet from 'helmet';
import morgan from 'morgan';
import * as expressLayouts from 'express-ejs-layouts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan('dev'));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(expressLayouts);
  app.set('layout', 'layouts/main');

  const PgSession = connectPgSimple(session);
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET ?? 'fallback-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: parseInt(process.env.SESSION_MAX_AGE ?? '86400000', 10),
        httpOnly: true,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // ─── Auto-inject ke semua view ────────────────────────────────────────────
  // Middleware ini berjalan di setiap request dan menyuntikkan tiga variabel
  // ke res.locals sehingga tersedia di SEMUA template EJS tanpa perlu
  // dikirim manual dari setiap controller.
  //
  // currentPath → untuk sidebar aktif state
  // user        → data admin yang sedang login (dari Passport session)
  // messages    → flash messages success/error (dibaca dan dikosongkan otomatis)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.currentPath = req.path;
    res.locals.user = req.user ?? null;
    res.locals.messages = {
      success: req.flash('success'),
      error: req.flash('error'),
      info: req.flash('info'),
    };
    next();
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Smart Venue Booking API')
    .setDescription('API documentation Smart Venue & Event Booking Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀 http://localhost:${port}`);
  console.log(`📖 Swagger: http://localhost:${port}/api-docs\n`);
}

void bootstrap();
