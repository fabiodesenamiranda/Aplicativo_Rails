class CategoriesController < ApplicationController
  def show
    @categories = Category.find(params[:id])
    @products = @categories.products
  end
end