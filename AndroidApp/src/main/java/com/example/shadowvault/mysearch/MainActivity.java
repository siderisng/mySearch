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
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Queue;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private Button bLogin;
    private EditText etUsernameMail;
    private EditText etPassword;
    private TextView registerLink;
    private String res;

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

        final String emailUsername = etUsernameMail.getText().toString();
        String password      = etPassword.getText().toString();
        String URL           = "https://immense-peak-9102.herokuapp.com/api/v1/phone/login";
        RequestQueue queue = Volley.newRequestQueue(this);


        if (emailUsername.isEmpty() || password.isEmpty()) {

            etUsernameMail.setText("");
            etPassword.setText("");
        }
        else {

            String jsonParams = ("{\"username\":\"" +emailUsername+"\",\"password\":\""+password+"\"}");
            JsonObjectRequest postRequest = new JsonObjectRequest( Request.Method.POST, URL,

                    new JSONObject(jsonParams),
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            try {
                                res = response.getString("authentication");
                                Intent intent = new Intent(getBaseContext(), MainMenu.class);
                                intent.putExtra("sessionCode", res);
                                startActivity(intent);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Toast.makeText(getApplicationContext(), error.toString() , Toast.LENGTH_LONG).show();
                        }
                    }) {
                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    HashMap<String, String> headers = new HashMap<String, String>();
                    headers.put("Content-Type", "application/json; charset=utf-8");
                    return headers;
                }
            };
            queue.add(postRequest);

        }







    }

}
