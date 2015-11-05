# DSS, Devourer Statistic Server

Devourer Statistic Server - multi-app statistic server with easy configuration based on Node.js. Can gather and show statistics on your every app.

### Version
0.2

### Build && Deploy

-- later --

### App configuration example

```json
{
	"app_name": "test_name",
	"app_key": "test",
	"app_is_show": true,

	"app_events": [
		{
			"event_name": "simple_request",
			"event_fields": ["username"]
		},
		{
			"event_name": "chat",
			"event_fields": ["username", "message"]
		}
	]
}
```

### DSS Response code:
- **20** JSON is not valid
- **21** JSON dont have required fields (Details: which one field)
- **25** The app key is invalid


### License
GPLv2
