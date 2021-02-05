import { post } from '@/api/api'

export function login(uEmail, uPwd) {
  return post('/user/login', { uEmail, uPwd })
}
