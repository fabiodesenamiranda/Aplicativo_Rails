class WebHooksController < ApplicationController
    skip_forgery_protection
    def stripe
        puts "Caiu Aqui"    
    end
end