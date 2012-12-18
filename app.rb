# dev hint: shotgun login.rb
require 'mongo'
#require 'bson_ext'
require 'json'
require 'sinatra'

#start connection to Mongo database
DB = Mongo::Connection.new.db("CBTapp", :pool_size => 5, :timeout =>5)

configure do
  set :public_folder, Proc.new { File.join(root, "static") }
  enable :sessions
end

helpers do
  def username
    session[:identity] ? session[:identity] : 'Hello stranger'
  end
end

before '/cbt*' do
  if !session[:identity] then
    session[:previous_url] = request['REQUEST_PATH']
    @error = 'Sorry guacamole, you need to be logged in to do that'
    halt erb(:login_form)
  end
end

get '/' do
  erb 'Click here for app: <a href="/cbt">CBT App</a>'
end

# Login stuff
get '/login/form' do 
  erb :login_form
end

post '/login/attempt' do
  session[:identity] = params['username']
  where_user_came_from = session[:previous_url] || '/'
  redirect to where_user_came_from 
end

get '/logout' do
  session.delete(:identity)
  erb "<div class='alert alert-message'>Logged out</div>"
end


# app stuff
get '/cbt' do 
  erb :appLayout, :attr_wrapper => '"', :locals =>  
  {:title => 'Our Sinatra CBT app'}  
end


get '/api/:incidents' do
  # query a collection :incidents, convert the output to an array, map the _id
  # to a string representation of the object's _id and finally output to JSON
  DB.collection(params[:incidents]).find.to_a.map{|t| from_bson_id(t)}.to_json
end

get '/api/:incidents/:id' do
  # get the first document with the id :id in the collection :incidents as a single document (rather
  # than a Cursor, the standard output) using find_one(). Our bson utilities assist with
  # ID conversion and the final output returned is also JSON
  from_bson_id(DB.collection(params[:incidents]).find_one(to_bson_id(params[:id]))).to_json
end

post '/api/:incidents' do
  # parse the post body of the content being posted, convert to a string, insert into
  # the collection #incidents and return the ObjectId as a string for reference
  oid = DB.collection(params[:incidents]).insert(JSON.parse(request.body.read.to_s))
  "{\"_id\": \"#{oid.to_s}\"}"
end

delete '/api/:incidents/:id' do
  # remove the item with id :id from the collection :incidents, based on the bson
  # representation of the object id
  DB.collection(params[:incidents]).remove('_id' => to_bson_id(params[:id]))
end

put '/api/:incidents/:id' do
  # collection.update() when used with $set (as covered earlier) allows us to set single values
  # in this case, the put request body is converted to a string, rejecting keys with the name '_id' for security purposes
  DB.collection(params[:incidents]).update({'_id' => to_bson_id(params[:id])}, {'$set' => JSON.parse(request.body.read.to_s).reject{|k,v| k == '_id'}})
end
# utilities for generating/converting MongoDB ObjectIDs
def to_bson_id(id) BSON::ObjectId.from_string(id) end
def from_bson_id(obj) obj.merge({'_id' => obj['_id'].to_s}) end













