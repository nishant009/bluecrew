export function unauthorizedErrorHandler(err, req, res, next) {
  if (err.status === 403) {
    res.status(err.code).render('Error', { Error: err.message });
  } else {
    next(err);
  }
}

export function badRequestErrorHandler(err, req, res, next) {
  if (err.status === 400) {
    res.status(err.code).render('Error', { Error: err.message });
  } else {
    next(err);
  }
}

// eslint-disable-next-line no-unused-vars
export function genericErrorHandler(err, req, res, next) {
  res.status(500).render('Error', { Error: err.message });
}
