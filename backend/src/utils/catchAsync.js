/**
 * Higher-order function to catch errors in async express routes
 * and pass them to the next() middleware.
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
