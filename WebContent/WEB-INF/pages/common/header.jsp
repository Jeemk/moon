<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="m" uri="/moon"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%--引入核心js和css --%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<m:require src="jquery,ui,extend,flex,zt,ze,fv"/>
<m:require src="icon" type="css"/>
<script type="text/javascript">
     <%-- 上下文路径--%>
     var contextPath = "${pageContext.request.contextPath}";
</script>
</head>
</html>