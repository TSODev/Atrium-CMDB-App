# Atrium CMDB Application

This is a simple NodeJS Application build to consume some Atrium CMDB RestAPI services to produce higher level RestAPI. (Query Instance - Query Relationship).

(img)

##Architecture :

**Data Layer :** An ARServer platform providing RestAPI services. (Atrium CMDB API is called by the App).

**Application Layer :** A ::NodeJS App:: , consuming CMDB Data to provide higher level RestAPI services displayed at the presentation layer (List of defined objects , attributes for these objects , tree relationship for an object with other objects)

**Presentation Layer :** ::AngularJS:: and ::VisJS:: to display data on Tables and Graphs.

##Usage
At Login page , fill fields with the IP Address/ServerName of the AR Server , port number for the RestAPI access , and user authentication in the AR Server platform. then navigate the app to display objects and relationship.
App can export data to CSV files (*Menu ‘Actions -> Export’*)

