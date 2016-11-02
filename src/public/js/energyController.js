(function () {
	// Best Practice: eerst module definieren, minify-safe $routeParams injecteren
	angular.module('myApp')
		.controller('energyController', energyController);

	// 2. Maak de detailcontroller
	//energyController.$inject = ['$routeParams'];
	function energyController ($http) {
		var vm = this;
		console.log('Get Da Power');
		// var data = {"xData": ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		//             "yData":[{
		// 							"name": "Tokyo",
		// 							"data": [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
		// }]}
		//
		// vm.data = "Test Data";
		// vm.lineChartYData=data.yData;
		// vm.lineChartXData=data.xData;
		$http.get('/energymeterdata')
			.success(function(data){
				console.log(data);
				vm.powers = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	}
})();
