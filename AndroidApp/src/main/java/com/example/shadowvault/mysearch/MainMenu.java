package com.example.shadowvault.mysearch;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

public class MainMenu extends AppCompatActivity {
    private String sessionCode;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_menu);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            sessionCode = extras.getString("sessionCode");
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        if (item.getItemId() == R.id.menu_main_Thing) {
            Toast.makeText(this,"left", Toast.LENGTH_SHORT).show();
        }
        else if (item.getItemId() == R.id.menu_main_anotherThing){
            Toast.makeText(this,"right", Toast.LENGTH_SHORT).show();
        }

        return true;
    }

}
