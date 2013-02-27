/**
 * EventAggregator
 *
 * Coordinates synchronization of a list of events and callbacks before 
 * emitting the "trigger" event.  
 * 
 * Utilization:
 * Instantiated as an object through factory method. 
 * 
 * @see EventEmitter    
 */

var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * Construct
 */
function EventAggregator() {
	EventEmitter.call(this);
	this._eventList = {};
}

/**
 * Inheritance
 */
util.inherits(EventAggregator, EventEmitter);

/**
 * Internal method to get a trigger event list
 */
EventAggregator.prototype._getEventList = function($trigger) {
	if(!this._eventList[$trigger]) {
		this._eventList[$trigger] = [];
	}
	return this._eventList[$trigger];
};

/**
 * Create a callback and pushes it to the trigger list 
 * 
 * @param $trigger, A string or array
 * @returns {Function}
 */
EventAggregator.prototype.waitCallback = function($trigger) {
	var triggers = (util.isArray($trigger)) ? $trigger : [$trigger];
	var _self = this;
	var pack = { 
		type: 'callback',
		trigger: triggers,
		isFired: 0
	};
	var callback = function() {
		_self._respond(pack);
	};
	callback.data = pack;
	
	// Push to event lists
	for(var i=0; i<triggers.length; i++) {
		this._getEventList(triggers[i]).push(pack);
	}
	return callback;
};

/**
 * Removes a specific callback from a trigger list
 * 
 * @param $trigger, A string or array
 * @param $callback
 */
EventAggregator.prototype.ignoreCallback = function($trigger, $callback) {
	var triggers = (util.isArray($trigger)) ? $trigger : [$trigger];
	
	// Remove from event lists
	for(var i=0; i<triggers.length; i++) {
		var list = this._getEventList(triggers[i]);
		var i = list.indexOf($callback.data);
		if(i != -1) {
			list.splice(i, 1);
		}
	}
};

/**
 * Add a specific EventEmitter and listener for an event
 * 
 * @param $trigger, A string or array
 * @param $emitter
 * @param $event
 */
EventAggregator.prototype.waitEvent = function($trigger, $emitter, $event) {
	var triggers = (util.isArray($trigger)) ? $trigger : [$trigger];
	var _self = this;
	var pack = {
		type: 'event',
		trigger: triggers,
		emitter: $emitter,
		event: $event,
		isFired: 0
	};
	
	// Listener
	pack.listener = function() {
		_self._respond(pack);
	};
	$emitter.addListener($event, pack.listener);
	
	// Push to event lists
	for(var i=0; i<triggers.length; i++) {
		this._getEventList(triggers[i]).push(pack);
	}
};

/**
 * Remove a specific EventEmitter and listener for an event
 * 
 * @param $trigger, A string or array
 * @param $emitter
 * @param $event
 */
EventAggregator.prototype.ignoreEvent = function($trigger, $emitter, $event) {
	var triggers = (util.isArray($trigger)) ? $trigger : [$trigger];
	
	// Remove from event lists
	for(var i=0; i<triggers.length; i++) {
		var list = this._getEventList(triggers[i]).filter(function($element, $index, $array) {
			if($element.emitter == $emitter && $element.event == $event) {
				$element.emitter.removeListener($element.event, $element.listener);
				return false;
			} else {
				return true;
			}
		}, this);
		
		this._eventList[triggers[i]] = list;
	}
};

/**
 * Reset all packages associated with a trigger
 * 
 * @param $trigger, A string or array
 */
EventAggregator.prototype.resetTrigger = function($trigger) {
	var triggers = (util.isArray($trigger)) ? $trigger : [$trigger];
	
	for(var i=0; i<triggers.length; i++) {
		var list = this._getEventList(triggers[i]);
		for(var i=0; i<list.length; i++) {
			list[i].isFired = 0;
		}
	}
};

/**
 * Remove all callbacks and events from a trigger
 * 
 * @param $trigger
 */
EventAggregator.prototype.clearTrigger = function($trigger) {
	var triggers = (util.isArray($trigger)) ? $trigger : [$trigger];
	
	for(var i=0; i<triggers.length; i++) {
		this._eventList[triggers[i]] = [];
	}
};

/**
 * Internal method to respond to a package (e.g. - data object associated
 * with a callback or an event).  Packages are counted once, consecutive
 * callbacks or events are not received.  
 * 
 * @param package
 */
EventAggregator.prototype._respond = function($package) {
	var triggers = $package.trigger;
	var trigger = triggers[0];
	if(this._getEventList(trigger).indexOf($package) != -1) {
		if(!$package.isFired) {
			$package.isFired++;
			this._checkEmit(trigger);
		}
	}
};

/**
 * Internal method to check if a trigger can be dispatched.  
 * 
 * @param $trigger
 */
EventAggregator.prototype._checkEmit = function($trigger) {
	if(this.check($trigger)) {
		this.emit($trigger);
	}
};

/**
 * Method to check if a trigger can be dispatched
 * 
 * @param $trigger
 * @return True if event list is empty
 */
EventAggregator.prototype.check = function($trigger) {
	var list = this._getEventList($trigger);
	if(!list.length) return false;
	for(var i=0; i<list.length; i++) {
		// Not ready
		if(!list[i].isFired) {
			return false;
		}
	}
	
	// Ready
	return true;
};

module.exports = {
	EventAggregator: EventAggregator
};
