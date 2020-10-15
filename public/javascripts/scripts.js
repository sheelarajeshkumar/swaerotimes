var app = angular.module('app017', ['ngRoute']);
app.config(function($routeProvider){
  $routeProvider
  .when('/:link', {
    controller: 'products',
    templateUrl: '/templates/products'
  })
});

app.filter('removeUnderscores', [function() {
  return function(string) {
    if (!angular.isString(string)) {
      return string;
    }
    return string.replace(/[/_/]/g, ' ');
  };
}]);

/*****api*to***fetch***category**list**/
app.service('categoryfeedapi',function ($http) {
  var obj = {};
  $http.get("/api/flipkart/categoryfeed")
 .then(function(response) {
        //console.log(response.data);
        var cats = response.data;
        angular.forEach(cats, function(value, key ){
          angular.forEach(value, function(value, key ){
            obj[key] = value;
          });
        });
      });
 return obj;
});

var controllers = {};
controllers.products = function($scope,$http,$routeParams,categoryfeedapi){
    angular.forEach(categoryfeedapi, function(value, key){
      if(key == $routeParams.link){
                  //$scope.link =value;
                  $http({
                    url: "/api/flipkart/productfeed",
                    method: 'POST',
                    data: {link : value}
                  }).success(function (data, status, headers, config) {
                          //handle success
                            var productsIn = [];
                          angular.forEach(data.productInfoList,function(value,key){
                            if(value.productBaseInfoV1['inStock']){

                            var mp = 0,
                                dp = 0,
                                special = 0,
                                sell = 0;
                                sale = false;

                              angular.forEach(value.productBaseInfoV1.flipkartSpecialPrice,function (value,key) {
                                if (key == 'amount') {
                                 special = value;
                                }
                              }); 

                              angular.forEach(value.productBaseInfoV1.flipkartSellingPrice,function (value,key) {
                                if (key == 'amount') {
                                 sell = value;
                                }
                              });



                              if(special < sell){
                                sale = true;
                                var mp = value.productBaseInfoV1.maximumRetailPrice.amount - special,
                                    dp = parseInt((mp/value.productBaseInfoV1.maximumRetailPrice.amount)*100);
                              }
                              else
                                dp = value.productBaseInfoV1.discountPercentage;

                              var productsInfo = {
                                productId: value.productBaseInfoV1.productId,
                                title: value.productBaseInfoV1.title,
                                productDescription: value.productBaseInfoV1.productDescription,
                                productBrand: value.productBaseInfoV1.productBrand,
                                maximumRetailPrice: value.productBaseInfoV1.maximumRetailPrice.amount,
                                flipkartSpecialPrice: special,
                                flipkartSellingPrice: sell,
                                discountPercentage: dp,
                                'productUrl':value.productBaseInfoV1.productUrl,
                                'offers':value.productBaseInfoV1.offers,
                                'imageUrls':value.productBaseInfoV1.imageUrls,
                                'currency':value.productBaseInfoV1.maximumRetailPrice.currency,
                                sale : sale
                              }
                              //console.log(value);
                              //console.log(productsInfo);
                              productsIn.push(productsInfo);
                            }
                          });
                          $scope.productsInfo = productsIn;
                        }).error(function (data, status, headers, config) {
                          //handle error
                          console.log(status); 
                        });
                      }
  });
}


/***Flipkart***/
/*Get top menu items as category */
/*Get sidebar menu items as category */
controllers.topController = function($scope,categoryfeedapi){
      $scope.flipkartCats = categoryfeedapi;
      $scope.len = Object.keys(categoryfeedapi).length;
}

controllers.sideController = function($scope,categoryfeedapi){
      $scope.flipkartCats = categoryfeedapi;
      $scope.len = $scope.flipkartCats.length;
}

app.controller(controllers);