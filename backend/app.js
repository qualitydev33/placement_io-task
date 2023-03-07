const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors')

const indexRouter = require('./routes/index');
const LineItemRoute = require('./routes/LineItemRoute');
const CampaignRoute = require('./routes/CampaignRoute');
const InvoiceRoute = require('./routes/InvoiceRoute');

const app = express();

app.use(logger('dev'));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'connect-src': ['\'self\'', 'https://v6.exchangerate-api.com/'],
        },
    })
);
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.use('/', indexRouter);
app.use('/line-items', LineItemRoute);
app.use('/campaigns', CampaignRoute);
app.use('/invoices', InvoiceRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).send();
});

module.exports = app;
