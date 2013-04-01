define(function(require){

	var qpf = require("qpf"),
		listItem = require("./listitem"),
		Container = qpf.use("components/container/container"),
		ko = qpf.use("knockout");

	var List = Container.derive(function(){

		return {
			
			dataSource : ko.observableArray([]),

			itemView : ko.observable(listItem),	// item component constructor
			
			selected : ko.observable()
		}
	}, {
		type : "LIST",
		
		css : "list",

		template : '<div data-bind="foreach:children" >\
						<div class="qpf-container-item">\
							<div data-bind="qpf_view:$data"></div>\
						</div>\
					</div>',

		initialize : function(){

			var oldArray = _.clone( this.dataSource() ),
				self = this;
			
			this.dataSource.subscribe(function(newArray){
				this._update(oldArray, newArray);
				oldArray = _.clone( newArray );
				_.each(oldArray, function(item, idx){
					if( ko.utils.unwrapObservable(item.selected) ){
						this.selected(idx)
					}
				}, this);
			}, this);

			this.selected.subscribe(function(idx){
				this._unSelectAll();
				var child = this.children()[idx];
				child &&
					child.$el.addClass("selected");
			}, this);

			this.$el.delegate(".qpf-container-item", "click", function(){
				var context = ko.contextFor( this);
				self.selected( context.$index() );
			})

			this._update([], oldArray);
		},

		_update : function(oldArray, newArray){

			var children = this.children(),
				ItemView = this.itemView(),
				result = [];

			var differences = ko.utils.compareArrays(oldArray, newArray);
			_.each(differences, function(item){
				if( item.status === "retained"){
					var index = oldArray.indexOf(item.value);
					result[ index ] = children[ index ];
				}else if( item.status === "added"){
					var newChild = new ItemView({
						attributes : item.value
					});
					newChild.render();
					result[item.index] = newChild;
					children.splice(item.index, 0, newChild);
				}else if(item.status === "deleted"){

				}
			}, this)
			this.children( result );
		},

		_unSelectAll : function(){
			_.each(this.children(), function(child, idx){
				child.$el.removeClass("selected")
			}, this)
		}

	})

	Container.provideBinding("list", List);

	return List;
})