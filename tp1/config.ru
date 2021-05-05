require 'bundler/setup'

require 'active_support/all'
require 'sinatra'
require 'sinatra/base'

helpers do
  def fib(n)
    return 1 if n == 0
    return 1 if n == 1
    fib(n-1) + fib(n-2)
  end
end

get '/io_bound' do
  File.read('blob.bin')
end

get '/cpu_bound' do
  {result: fib(64)}.to_json
end

run Sinatra::Application
