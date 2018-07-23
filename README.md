# foodies-bot
##This is an advanced NodeJS powered Foodbot using Facebook Messenger API.
The bot is linked to a Facebook App 'FoodiesBot' Page-> This Bot can be attached to any page and then act as the 'Chat Guy'.

##What it does?
Once attached to a page, it will autonomously respond to anyone who messages with a Food Menu in reply. 
The user can then select a category and it would show respective food items in that category.
User can then add items to its cart and keep on selecting new food items if he wants to. 
User can then either checkout or remove items from his final cart, once done , User can checkout with his cart and the TOTAL CART PRICE.
The specific Facebook page can be informed about the Order via a web push ( not worked on this yet) or by other means (email , SMS)

##Technical Stuff
FrontEnd -> Facebook Messenger API with required permissions to reply subsribe to a page (to get all the permissions is a pain in the ASS!)
Behind the scenes -> NodeJS
Database -> MongoDB freely hosted mlab
Deployment -> Free Dynos on Herkoku




Live demo ->  http://facebook.com/foodiesbot  (Not sure it will reply or NOT, depends on the Free Dynos available)


This project can be further extened to a full blown product , But for that i need time :(
