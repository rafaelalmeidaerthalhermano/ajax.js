var Ajax = new Class(function (defaults) {
    var query;

	defaults = defaults || {};
	defaults.method = defaults.method || 'GET';
	defaults.url = defaults.url || '/';
	defaults.data = defaults.data || null;
	defaults.evaljson = defaults.evaljson || false;
	defaults.onerror = defaults.onerror || null;
	defaults.onsuccess = defaults.onsuccess || null;

	query = function (obj, label) {
	    var query_string = "",
	        key;

	    label = label || '';

	    if (
    		obj.constructor === Number ||
    		obj.constructor === String ||
    		obj.constructor === Boolean ||
    		obj.constructor === Date
		) {
            return label + '=' + escape(obj);
	    } else if (obj.constructor === Object) {
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	            	query_string += query(obj[key], (label ? label + '[' + key + ']' : key)) + '&';
	            }
	        }
	        return query_string.slice(0, query_string.length - 1);
	    } else {
	    	return label + '=' + escape(obj);
	    }
	};

	this.request = function (url, params) {
	    var requester, success, error;
        
	    success = function (cb) {
	    	var data;
	    	if (cb) {
	    		if (params.evaljson) {
	    			data = eval('(' + requester.responseText + ')');
	    		} else if (defaults.evaljson) {
	    			data = eval('(' + requester.responseText + ')');
	    		}
	    		cb(requester.responseText);
	    	}
	    };

	    error = function (cb) {
	    	if (cb) {
	    		cb();
	    	}
	    };

        if (
        	window.XDomainRequest &&
        	url.indexOf('http://') > -1
    	) {
            requester = new XDomainRequest();
        } else if (window.XMLHttpRequest) {
            requester = new XMLHttpRequest();
        } else {
        	requester = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (requester) {
			requester.onreadystatechange = function () {
				if (requester.readyState === 4) {
					if (requester.status != 200 && requester.status != 304) {
						error(params.onerror || defaults.onerror);
					} else {
						success(params.onsuccess || defaults.onsuccess);
					}
				}
			};
            requester.open(
            	params.method || defaults.method,
            	(url || defaults.url) + ((params.data || defaults.data) ? '?' + query(params.data || defaults.data) : ''),
            	true
        	);
        	requester.setRequestHeader('User-Agent','XMLHTTP/1.0');
        	if (params.data || defaults.data) {
        		requester.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        	}
            requester.send();
        }

	};

	this.get = function (url, params) {
		params = params || {};
		params.method = 'GET';
		this.request(url, params);
	};

	this.put = function (url, params) {
		params = params || {};
		params.method = 'PUT';
		this.request(url, params);
	};

	this.post = function (url, params) {
		params = params || {};
		params.method = 'POST';
		this.request(url, params);
	};

	this.del = function (url, params) {
		params = params || {};
		params.method = 'DELETE';
		this.request(url, params);
	};

});
