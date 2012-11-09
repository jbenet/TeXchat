# TeXchat

## About

TeXchat is a simple web chat service that renders TeX math. Check it out at [http://texchat.juanbb.com](http://texchat.juanbb.com)!

The goal is to make it trivially easy to have a conversation with
someone else in the web, using mathematical symbols.

Currently, the prettiest math rendering is TeX math, which
[http://www.mathjax.org/](MathJax) has ellegantly brought to the web. This is
coupled with a simple chat service on top of socket.io.

If you have any suggestions, feedback, issues, etc: please start a topic in the
[http://github.com/jbenet/TeXchat/issues](github issues) page.
Feel free to contact the author directly, but github is preferable.

TeXchat is built by [http://github.com/jbenet](Juan Batiz-Benet).

## Install

    git clone https://github.com/jbenet/TeXchat/ texchat
    cd texchat
    npm install
    node backend/server.js

Then go to [http://localhost:8080/](http://localhost:8080/) in your favorite
web browser.

## Heroku

TeXchat is ready to be used with heroku. Simply:

    heroku apps:create <app name>
    git push heroku master
    heroku ps:scale web=1

Unfortunately Heroku does not support websockets, so TeXchat will default to
longpolling. Pusher is an addon that supports it, but it is rather pricey. If a
workaround exists, would be happy to hear about it!

## License

TeXchat is under the MIT License.
All dependency libraries are each under their own license.

## Contact

Project Homepage:
[https://github.com/jbenet/TeXchat](https://github.com/jbenet/TeXchat)

Feel free to contact me. But please file issues in github first. Cheers!

