//
//  SignupScreen.swift
//  mySearch
//
//  Created by Panagiotis Tzimotoudis on 10/27/15.
//  Copyright © 2015 Panagiotis Tzimotoudis. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class SignupScreen: UIViewController {
    //@IBOutlet weak var usernameTxt: UITextField!
    //@IBOutlet weak var passwordTxt: UITextField!
    @IBOutlet weak var emailTxt: UITextField!
    @IBOutlet weak var usernameTxt: UITextField!
    @IBOutlet weak var passwordTxt: UITextField!
    @IBOutlet weak var retypedPasswordTxt: UITextField!
    @IBOutlet weak var nameTxt: UITextField!
    @IBOutlet weak var surnameTxt: UITextField!
    @IBOutlet weak var ageTxt: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any addtional setup after loading the view
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any recourses thtat can be recreated
    }
    
    func errorMessageAllert ( errorStringToPrint: String ) {
        let alertView = UIAlertController(title: "Login Failed!", message: "\(errorStringToPrint)", preferredStyle: .Alert)
        let action = UIAlertAction(title: "OK", style: .Default){ _ in }
        alertView.addAction(action)
        self.presentViewController(alertView, animated: true){}
    }
    
    func clearTextFields ( emailTextField: Bool, usernameTextField: Bool, passwordTextField: Bool, retypedPasswordTextField: Bool ) {
        if ( emailTextField == true ) {
            emailTxt.text = ""
        }
        if ( usernameTextField == true ) {
            usernameTxt.text = ""
        }
        if ( passwordTextField == true ) {
            passwordTxt.text = ""
        }
        if ( retypedPasswordTextField == true ) {
            retypedPasswordTxt.text = ""
        }
    }
    
    @IBAction func signupTapped(sender: UIButton) {
        let email:String = emailTxt.text!
        let username:String = usernameTxt.text!
        let password:String = passwordTxt.text!
        let retypedPassword:String = retypedPasswordTxt.text!
        let name:String = nameTxt.text!
        let surname:String = surnameTxt.text!
        let age:String = ageTxt.text!
        
        if ( email.isEmpty || username.isEmpty || password.isEmpty || retypedPassword.isEmpty ) {
            errorMessageAllert("Email, username, password and retyped password are mandatory! Please try again.")
            clearTextFields(false, usernameTextField: false, passwordTextField: true, retypedPasswordTextField: true)
        }else {
            if ( !password.isEqual(retypedPassword) ) {
                errorMessageAllert("Password and retyped password must be equal! Please try again.")
                clearTextFields(false, usernameTextField: false, passwordTextField: true, retypedPasswordTextField: true)
            }else {
                // Try to signup!!!
                let serverName: String = "https://immense-peak-9102.herokuapp.com/api/v1/phone/signup"
                let postData = ["email": "\(email)", "username": "\(username)", "password": "\(password)", "name": "\(name)", "surname": "\(surname)", "age": "\(age)"]
                Alamofire.request(.POST, serverName, parameters: postData, encoding: .JSON)
                    .responseJSON { response in
                        guard response.result.error == nil else {
                            // got an error in getting the data, need to handle it
                            self.errorMessageAllert("Server Error! Try Again.")
                            return
                        }
                        
                        if let value: AnyObject = response.result.value {
                            let post = JSON(value)
                            print(post.description)
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
                                self.clearTextFields(true, usernameTextField: true, passwordTextField: true, retypedPasswordTextField: true)
                            }
                        }
                }
            }
        }
    }
    
    @IBAction func alreadyHaveAccountTapped(sender: UIButton) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
}