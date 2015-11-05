package com.example.shadowvault.mysearch;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private Button bLogin;
    private EditText etUsernameMail;
    private EditText etPassword;
    private TextView registerLink;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etUsernameMail = (EditText) findViewById(R.id.etUsernameMail);
        etPassword = (EditText) findViewById(R.id.etPassword);
        registerLink = (TextView) findViewById(R.id.registerLink);
        bLogin = (Button) findViewById(R.id.bLogin);
        bLogin.setOnClickListener(this);
        registerLink.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.bLogin:
                try {
                    Login();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case R.id.registerLink:
                startActivity(new Intent(this, Register.class));
                break;


        }

    }


    private void Login() throws Exception {

        if (etUsernameMail.getText().toString() ==  "" || etPassword.getText().toString() ==  ""){
            etUsernameMail.setText("");
            etPassword.setText("");
        }
        String emailUsername = etUsernameMail.getText().toString();
        String password      = etPassword.getText().toString();

        Map request = new HashMap();

        request.put("username", emailUsername);
        request.put("password", password);
        JSONObject req = getJsonObjectFromMap(request);
        Log.d("login",req.toString());

        Log.d ("Login", "Making Login Request with object " + request.toString());
        Map resp = makeRequest(new URL("http://192.168.1.4:8000/api/v1/login"), request);

    }


    private Map makeRequest(URL url, Map params) throws Exception
    {
        HttpURLConnection httpCon = (HttpURLConnection) url.openConnection();
        httpCon.setDoOutput(true);
        httpCon.setDoInput(true);
        httpCon.setUseCaches(false);
        httpCon.setRequestProperty("Content-Type", "application/json");
        httpCon.setRequestProperty("Accept", "application/json");
        httpCon.setRequestMethod("POST");
        httpCon.connect(); // Note the connect() here

        OutputStream os = httpCon.getOutputStream();
        OutputStreamWriter osw = new OutputStreamWriter(os, "UTF-8");

        //convert parameters into JSON object
        JSONObject holder = getJsonObjectFromMap(params);

        osw.write(holder.toString());
        osw.flush();
        osw.close();
        return new HashMap();

    }



    private static JSONObject getJsonObjectFromMap(Map params) throws JSONException, JSONException {

        Iterator iter = params.entrySet().iterator();

        //Stores JSON
        JSONObject holder = new JSONObject();

        while (iter.hasNext())
        {
            //gets an entry in the params
            Map.Entry pairs = (Map.Entry)iter.next();

            //creates a key for Map
            String key = (String)pairs.getKey();

            //Create a new map
            Map m = (Map)pairs.getValue();

            //object for storing Json
            JSONObject data = new JSONObject();

            //gets the value
            Iterator iter2 = m.entrySet().iterator();
            while (iter2.hasNext())
            {
                Map.Entry pairs2 = (Map.Entry)iter2.next();
                data.put((String)pairs2.getKey(), (String)pairs2.getValue());
            }

            holder.put(key, data);
        }
        return holder;
    }

}
