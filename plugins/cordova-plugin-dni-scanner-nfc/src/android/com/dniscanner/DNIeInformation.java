package com.dniscanner;

import com.google.gson.Gson;

/**
 * Created by ViDSigner on 07/09/2017.
 */
public class DNIeInformation {
    public String DniNumber;
    public String Name;
    public String Surname;
    public String Sex;
    public String Nationality;
    public String DateOfBirth;
    public String DateOfExpiry;
    public String PhotoB64;
    public String Address;
    public String City;
    public String Province;
    public String BirthPlace;
    public String Phone;

    @Override
    public String toString(){
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
