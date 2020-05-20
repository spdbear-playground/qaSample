import moment from 'moment'
export default (_context, inject) => {
  inject('moment', moment)
}
