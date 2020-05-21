const getUniqueStr = (myStrong: number) => {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong + Math.random()).toString(16)
  );
};

export default (
  _context: any,
  inject: (arg0: string, arg1: (myStrong: any) => string) => void
) => {
  inject("uniqStr", getUniqueStr);
};
