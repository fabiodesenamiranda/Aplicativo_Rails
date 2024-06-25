Rails.application.routes.draw do
  namespace :admin do
    resources :orders
    resources :products do
      resources :stocks
    end
    resources :categories
  end

  devise_for :admins

  authenticated :admin do
    root to: "admin#index", as: :admin_root
  end

  get "admin" => "admin#index"
  resources :categories, only: [:show]
  resources :products, only: [:show]

  root "home#index"

end