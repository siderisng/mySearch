package com.example.shadowvault.mysearch;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
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
import java.lang.reflect.Array;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Queue;
public class Register extends AppCompatActivity implements View.OnClickListener {
    private EditText etEmail,etUsername,etPassword,etRepPass,etName,etSurname,etAge;
    private Button bRegister;
    private String res;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        etEmail    = (EditText) findViewById(R.id.etEmail);
        etUsername = (EditText) findViewById(R.id.etUsername);
        etPassword = (EditText) findViewById(R.id.etPassword);
        etRepPass  = (EditText) findViewById(R.id.etRepPass);
        etName     = (EditText) findViewById(R.id.etName);
        etSurname  = (EditText) findViewById(R.id.etSurname);
        etAge      = (EditText) findViewById(R.id.etAge);
        bRegister = (Button) findViewById(R.id.bRegister);
        bRegister.setOnClickListener(this);
    }
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.bRegister:
                try {
                    Register();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
        }
    }
    private void Register() throws Exception {
        String Email         = etEmail.getText().toString();
        String Username      = etUsername.getText().toString();
        String Password      = etPassword.getText().toString();
        String RepPass       = etRepPass.getText().toString();
        String Name          = etName.getText().toString();
        String Surname       = etSurname.getText().toString();
        String Age           = etAge.getText().toString();
        String URL           = "https://immense-peak-9102.herokuapp.com/api/v1/phone/signup";
        //String URL = "http://192.168.1.4:8000/api/v1/signup";
        RequestQueue queue = Volley.newRequestQueue(this);
        String Error="Please insert ";
        if (Email.isEmpty()) {
            Error=Error+"Email ";
        }
        if (Username.isEmpty()) {
            Error=Error+"Username ";
        }
        if (Password.isEmpty()) {
            Error=Error+"Password ";
        }
        if (RepPass.isEmpty()) {
            Error=Error+"'RepeatPassword' field ";
        }
        if (Name.isEmpty()) {
            etName.setText("");
        }
        if (Surname.isEmpty()) {
            etSurname.setText("");
        }
        if (Age.isEmpty()) {
            etAge.setText("");
        }
        if (!Password.equals(RepPass) && (!Password.isEmpty() && !RepPass.isEmpty())) {
            etPassword.setText("");
            etRepPass.setText("");
            Error=Error+"\nYour password does not match ";
        }
        if (!Error.equals("Please insert ")) {
            Toast.makeText(this, Error, Toast.LENGTH_LONG).show();
            return;
        }
        else {
            String jsonParams = ("{\"email\":\""+Email+"\",\"password\":\""+Password +"\",\"username\":\""+Username+"\",\"name\":\""+Name+"\",\"surname\":\""+Surname+"\",\"age\":\""+Age+"\"}");
            JsonObjectRequest postRequest = new JsonObjectRequest( Request.Method.POST, URL,
                    new JSONObject(jsonParams),
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            try {
                               res = response.getString("authentication");
//                                Intent intent = new Intent(getBaseContext(), MainMenu.class);
//                                intent.putExtra("sessionCode", res);
//                                startActivity(intent);
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
