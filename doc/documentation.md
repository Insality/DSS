# DSS, Devourer Statistic Server

Devourer Statistic Server - multi-app statistic server with easy configuration based on Node.js. Can gather and show statistics on your every app.

### Version
0.2

### Build && Deploy

-- later --

### App configuration example

```json
{
	"app_name": "test_name", // required field
	"app_key": "test", 
	"app_is_show": true,

	"app_events": [ // required field
		{
			"event_name": "simple_request", // required field
			"event_fields_unique": [], // required field
			"event_fields_required": ["event"], // required field
			"event_fields_optional": ["version"] // required field
		},
		{
			"event_name": "chat",
			"event_fields_unique": ["username"],
			"event_fields_required": ["score"],
			"event_fields_optional": ["version"],
			"event_stats": [
				{
					"stat_name": "simple",
					"stat_snippet": "short description",
					"stat_type": "table",
					"stat_fun": "Last(hour)=>Sort(score)=>Limit(10)"
				}
			]
		}
	]
}
```

stat_fun:
Last(hour|day|week|month|year): return a records in this period
Period(from, to): return a records in this period
Count(): return a count of record
Limit(n): return a top N records from a data
max(field), min(field): return a record, where field have a max/min value
Sort(field), SortReversed(field): Sort the records by a field

stat_type:
table: render a records in a raw table
graph: render a records in a graph view

### DSS Response code:
- **20** JSON is not valid
- **21** JSON dont have required fields (Details: which one field)
- **25** The app key is invalid


### License
GPLv2
