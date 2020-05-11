


const cors = async (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  	res.header(
    	"Access-Control-Allow-Headers",
    	"Origin, X-Requested-With, Content-Type, Accept, Authorization"
  	);

    next();
};


module.exports = auth;