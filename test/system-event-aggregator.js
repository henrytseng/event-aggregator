var should = require('should');
var EventEmitter = require('events').EventEmitter;
var EventAggregator = require('event-aggregator').EventAggregator;

describe('EventAggregator', function() {
	
	describe('#wait()', function() {
		it('should add an emitter and multiple events and dispatch trigger', function($done) {
			var a = new EventEmitter();
			var aggregator = new EventAggregator();
			
			aggregator.waitEvent('complete', a, 'ready');
			setTimeout(function() {
				a.emit('ready');
			}, 1);
			aggregator.waitEvent('complete', a, 'on');
			setTimeout(function() {
				a.emit('on');
			}, 2);
			
			aggregator.on('complete', function() {
				$done();
			});
		});
		
		it('should add two callbacks and dispatch trigger', function($done) {
			var aggregator = new EventAggregator();
			
			setTimeout(aggregator.waitCallback('complete'), 1);
			setTimeout(aggregator.waitCallback('complete'), 1.1);
			
			aggregator.on('complete', function() {
				$done();
			});
		});
		
		it('should add a callback and an event and dispatch trigger', function($done) {
			var a = new EventEmitter();
			var aggregator = new EventAggregator();
			
			setTimeout(aggregator.waitCallback('complete'), 1);
			
			aggregator.waitEvent('complete', a, 'ready');
			setTimeout(function() {
				a.emit('ready');
			}, 2);
			
			aggregator.on('complete', function() {
				$done();
			});
		});
	});
	
	describe('#ignore()', function() {
		it('should add two callbacks and remove one and dispatch trigger', function($done) {
			var aggregator = new EventAggregator();
			var callback = null;
			
			setTimeout(aggregator.waitCallback('complete'), 1);
			callback = aggregator.waitCallback('complete');
			
			aggregator.ignoreCallback('complete', callback);
			aggregator.on('complete', function() {
				$done();
			});
		});
		
		it('should add two events and remove one and dispatch trigger', function($done) {
			var aggregator = new EventAggregator();
			var a = new EventEmitter();
			
			aggregator.waitEvent('complete', a, 'ready');
			setTimeout(function() {
				a.emit('ready');
			}, 1);
			
			aggregator.waitEvent('complete', a, 'on');
			aggregator.ignoreEvent('complete', a, 'on');
			
			aggregator.on('complete', function() {
				$done();
			});
		});
	});
});
