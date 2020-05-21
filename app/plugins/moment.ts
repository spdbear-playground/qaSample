import moment from "moment";
export default (
  _context: any,
  inject: (arg0: string, arg1: typeof moment) => void
) => {
  inject("moment", moment);
};
