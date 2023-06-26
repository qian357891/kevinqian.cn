```java
public class HelloServlet extends HttpServlet {
    @Override
    public void init() throws ServletException {
        System.out.println("1.初始化HelloServlet类");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//        super.doGet(req, resp);
        System.out.println("2.get请求");
//        上下文路径
        System.out.println(req.getContextPath());
//        请求路径
        System.out.println(req.getRequestURL());
//        请求方法
        System.out.println(req.getMethod());
//        前端参数传递到后端常用的方法
//        请求参数name = ?
        System.out.println(req.getParameter("name"));
//        请求参数pass = ?
        System.out.println(req.getParameter("pass"));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doPost(req, resp);
        System.out.println("post请求");
    }

    @Override
    public void destroy() {
        System.out.println("3.销毁HelloServlet");
    }
}
```



url：`localhost:9090/tomcat_demo_1/hello?name=qk&pass=123`

输出

```
1.初始化HelloServlet类
2.get请求
/tomcat_demo_1
http://localhost:9090/tomcat_demo_1/hello
GET
qk
123
```

