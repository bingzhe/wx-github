```
header("Content-Type:text/html;charset=utf-8");
$url = "https://api.github.com/users/bingzhe";
ini_set("user_agent",'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322)');
$a = file_get_contents($url);
// $a = json_decode($a);
echo $a;
```