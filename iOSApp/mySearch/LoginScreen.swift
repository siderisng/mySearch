//
//  LoginScreen.swift
//  mySearch
//
//  Created by Panagiotis Tzimotoudis on 10/27/15.
//  Copyright © 2015 Panagiotis Tzimotoudis. All rights reserved.
//
import UIKit
import Alamofire
import SwiftyJSON

class LoginScreen: UIViewController {
    @IBOutlet weak var usernameTxt: UITextField!
    @IBOutlet weak var passwordTxt: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any addtional setup after loading the view
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any recourses thtat can be recreated
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(true)
        
        let prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
        let isLoggedIn:Int = prefs.integerForKey("ISLOGGEDIN") as Int
        if ( isLoggedIn == 1 ) {
            self.dismissViewControllerAnimated(true, completion: nil)
        }
    }
    func errorMessageAllert ( errorStringToPrint: String ) {
        let alertView = UIAlertController(title: "Login Failed!", message: "\(errorStringToPrint)", preferredStyle: .Alert)
        let action = UIAlertAction(title: "OK", style: .Default){ _ in }
        alertView.addAction(action)
        self.presentViewController(alertView, animated: true){}
    }
    
    func clearTextFields ( usernameTextField: Bool, passwordTextField: Bool ) {
        if ( usernameTextField == true ) {
            usernameTxt.text = ""
        }
        if ( passwordTextField == true ) {
            passwordTxt.text = ""
        }
    }
    @IBAction func loginTapped(sender: UIButton) {
        let username:String = usernameTxt.text!
        let password:String = passwordTxt.text!
        
        if ( username.isEmpty || password.isEmpty ) {
            errorMessageAllert("Please enter Username and Password")
            clearTextFields(false, passwordTextField: true)
        }else {
            let serverName: String = "https://immense-peak-9102.herokuapp.com/api/v1/phone/login"
            let postData = ["username": "\(username)", "password": "\(password)"]
            Alamofire.request(.POST, serverName, parameters: postData, encoding: .JSON)
                .responseJSON { response in
                    guard response.result.error == nil else {
                        // got an error in getting the data, need to handle it
                        self.errorMessageAllert("Server Error! Try Again.")
                        return
                    }
                    
                    if let value: AnyObject = response.result.value {
                        let post = JSON(value)
                        if let _ = post["authentication"].string {
                            let prefs: NSUserDefaults = NSUserDefaults.standardUserDefaults()
                            prefs.setObject(username, forKey: "USERNAME")
                            prefs.setObject(post["authentication"].string, forKey: "SESSIONCODE")
                            prefs.setInteger(1, forKey: "ISLOGGEDIN")
                            prefs.synchronize()
                            self.dismissViewControllerAnimated(true, completion: nil)
                        }
                        else {
                            self.errorMessageAllert("Couldn't Login. " + post["errorMessage"].string!)
                            self.clearTextFields(true, passwordTextField: true)
                        }
                    }
            }
        }
    }
}