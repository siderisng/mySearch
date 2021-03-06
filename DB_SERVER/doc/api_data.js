define({ "api": [
  {
    "type": "get",
    "url": "/api/v1/city/list",
    "title": "Get list of available citiez",
    "name": "getCity",
    "group": "City",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "cities",
            "description": "<p>List of cities</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "['city1', 'city2', ... , 'cityN']",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400",
            "description": "<p>BAD REQUEST</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{errorMessage: ERROR_MESSAGE }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/dbAPI.js",
    "groupTitle": "City"
  },
  {
    "type": "get",
    "url": "/api/v1/city/:name",
    "title": "Get info about specified city",
    "name": "getCity",
    "group": "City",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "city",
            "description": "<p>City Object</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\t\n\tname : city_name,\n\tlocation : city_location,\n\tzones \t: city_zones,\n\tlistOfRequests : city_list_of_unsorted_requests\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400",
            "description": "<p>BAD REQUEST</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{errorMessage: ERROR_MESSAGE }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/dbAPI.js",
    "groupTitle": "City"
  },
  {
    "type": "get",
    "url": "/api/v1/request/sorted_list",
    "title": "Get sorted list of most common requests",
    "name": "getSortedList",
    "group": "City",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "requests",
            "description": "<p>List of Requests</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "['Request#1', 'Request#2', ... , 'Request#N']",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400",
            "description": "<p>BAD REQUEST</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{errorMessage: ERROR_MESSAGE }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/dbAPI.js",
    "groupTitle": "City"
  },
  {
    "type": "post",
    "url": "/api/v1/city",
    "title": "Update city or create new city entity",
    "name": "updateCityInfo",
    "group": "City",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "cityData",
            "description": "<p>City info</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "   {\n\t\tname \t\t: city_name,\n\t\tlocation\t: city_location,\n\t\trequest\t\t: request_made_to_city \t\t\n\t}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "successMessage",
            "description": "<p>Success message</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{successMessage : SUCCESS_MESSAGE}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400",
            "description": "<p>BAD REQUEST</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{message: ERROR_MESSAGE }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/dbAPI.js",
    "groupTitle": "City"
  },
  {
    "type": "post",
    "url": "/api/v1/request",
    "title": "Create new request",
    "name": "createRequest",
    "group": "Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "requestInfo",
            "description": "<p>Info of request to create</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "   {\n\t\tcountry : country_where_request_was_made,\n\t\tcity    : city_where_request_was_made,\n\t\tlocation : location_where_request_was_made,\n\t\tquery    : what_user_searched_for,\t\t\n\t\tgoogleResults : google_answer\n\t\t\n\t\t\t\n\t}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>New request id</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{id : new_request_id}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400",
            "description": "<p>BAD REQUEST</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{message: ERROR_MESSAGE }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/dbAPI.js",
    "groupTitle": "Request"
  },
  {
    "type": "post",
    "url": "/api/v1/request/list",
    "title": "Get a list of requests",
    "name": "getRequestList",
    "group": "Request",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "idarray",
            "description": "<p>Array of request idz</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "[ id_1, id_2, id_3, ... , id_n]",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "listOfRequests",
            "description": "<p>List of requests specified</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[ request_1, request_2, ..., request_n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400",
            "description": "<p>BAD REQUEST</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{message: ERROR_MESSAGE }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/dbAPI.js",
    "groupTitle": "Request"
  },
  {
    "type": "post",
    "url": "/api/v1/request/:query",
    "title": "Get a list of requests based on query",
    "name": "getRequestQuery",
    "group": "Request",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>json</p> ",
            "optional": false,
            "field": "listOfRequests",
            "description": "<p>List of requests specified</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[ request_1, request_2, ..., request_n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400",
            "description": "<p>BAD REQUEST</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{message: ERROR_MESSAGE }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/api/dbAPI.js",
    "groupTitle": "Request"
  }
] });