import { MULTITENANT } from '../consts'

const MAPPING = MULTITENANT && (function() {
  try {
    return JSON.parse(process.env.DOMAIN_TO_ORGID)
  } catch(err) {
    throw new Error('process.env.DOMAIN_TO_ORGID must be JSON string')
  }   
})()

function getOrgID (req) {
  req.orgid = MAPPING[req.hostname]
  return req.orgid !== undefined
}

export default function _loadOrgID (req, res, next) {
  return MULTITENANT 
    ? getOrgID(req) ? next() : next(404)
    : next() 
}