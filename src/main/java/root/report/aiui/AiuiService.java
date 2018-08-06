package root.report.aiui;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import root.configure.AppConstants;

@RestController
@RequestMapping("/reportServer/aiui")
public class AiuiService {

    @PostMapping(value="/analyseSentense",produces = "text/plain;charset=UTF-8")
    public String analyseSentense(){
        String word = "电讯盈科";

        return null;
    }
}
