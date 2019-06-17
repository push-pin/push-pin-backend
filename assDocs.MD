Asses

post '/'
  post new route
  supply
    - courseId
    - type (reading, solo, mob)
    - title
    - instructions
    - dateAvailable
    - dateDue
    - dateClosed

get '/assId'
  returns
    - ass by id

get '/bycourse/courseId'
  returns
    - asses by course id that are active

get '/bycourse/inactive/courseId'
  returns
    - asses by course id that are inactive

patch '/assId'
  return new updated ass

delete '/assId'
  returns deleted ass with active property as false
