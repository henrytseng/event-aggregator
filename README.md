EventAggregator
================

[![Build Status](https://travis-ci.org/henrytseng/event-aggregator.png?branch=master)](https://travis-ci.org/henrytseng/event-aggregator)

A nodejs module that emits events after a specified set of events and callbacks have been triggered.  

EventAggregator is designed to coodinate events and callbacks dispatched in an asynchonous environment.  

## Installation

	$ npm install event-aggregator
    
## Quick Start

Import the class from the *event-aggregator* module:

	var EventAggregator = require('event-aggregator').EventAggregator;

First, let's create an aggregator

	var aggregator = new EventAggregator();
	
Now let's tell the instance to wait for ```resource1``` to emit ```ready```

	aggregator.waitEvent('complete', resource1, 'ready');
	
And then let's tell the instance to wait for a callback to be dispatched from ```resource2```	

	resource2.createConnection(aggregator.waitCallback('complete'));

Once these two events occur ```aggregator``` will dispatch ```compmlete```

	aggregator.on('complete', function() {
		// ...
	});
	
## Triggering Multiple Events

Pass an array to add multiple triggers (multiple dependencies on an event/callback):

	aggregator.waitEvent(['complete', 'ready', 'destroy'], resource1, 'connect');

## Removing Events

Removed an event or callback:
	
	// Remove an event
	aggregator.ignoreEvent('complete', resource1, 'connect');
	
	// Remove a callback
	aggregator.ignoreCallback('complete', myCallback);

## Restarting

Reset a trigger, wait for all callbacks and events to execute again:

	aggregator.resetTrigger('complete');

## Clearing

Clear a trigger, remove all subscribed events and callbacks:
	
	aggregator.clearTrigger('complete');
	
## Checking the Status
	
Check the status:

	aggregator.check('complete');
	

## License

(The MIT License)

Copyright (c) 2013 Henry Tseng (http://www.henrytseng.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.