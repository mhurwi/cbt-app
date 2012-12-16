get '/api/:incidents' do  
  # query a collection :incidents, convert the output to an array, map the id  
  # to a string representation of the object's _id and finally output to JSON  
  DB.collection(params[:incidents]).find.toa.map{|t| frombsonid(t)}.to_json  
end  
get '/api/:incidents/:id' do 
  # get the first document with the id :id in the collection :incidents as a single document (rather 
  # than a Cursor, the standard output) using findone(). Our bson utilities assist with 
  # ID conversion and the final output returned is also JSON 
  frombsonid(DB.collection(params[:incidents]).findone(tobsonid(params[:id]))).to_json 
end 
post '/api/:incidents' do 
  # parse the post body of the content being posted, convert to a string, insert into 
  # the collection #thing and return the ObjectId as a string for reference 
  oid = DB.collection(params[:incidents]).insert(JSON.parse(request.body.read.tos)) 
  "{\"id\": \"#{oid.to_s}\"}" 
end 
delete '/api/:incidents/:id' do 
  # remove the item with id :id from the collection :incidents, based on the bson 
  # representation of the object id 
  DB.collection(params[:incidents]).remove('id' => tobson_id(params[:id])) 
end 
put '/api/:incidents/:id' do 
  # collection.update() when used with $set (as covered earlier) allows us to set single values 
  # in this case, the put request body is converted to a string, rejecting keys with the name 'id' for security purposes 
  DB.collection(params[:incidents]).update({'id' => tobsonid(params[:id])}, {'$set' => JSON.parse(request.body.read.tos).reject{|k,v| k == 'id'}}) 
end 


# utilities for generating/converting MongoDB ObjectIds 

def tobsonid(id) BSON::ObjectId.fromstring(id) end 
def frombsonid(obj) obj.merge({'id' => obj['id'].tos}) end