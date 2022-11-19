### beforeCreate与create

两者都不能操作实例的属性。create多用于网络请求



### beforeUpdate与update

update可以用于类似聊天室的场景，当有新消息时，可以用update触发滚动。从而使其一直显示最新消息。



### beforeUnmount与unmount

在使用播放器的时候，如果不进行卸载，可能会出现多个播放器同时播放的场景。

或者使用定时器，如果不进行卸载，会一直占用资源。