package com.dniscanner;

import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.AsyncTask;
import android.util.Base64;
import android.widget.Toast;
import android.util.Log;
import android.graphics.Bitmap;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.security.KeyStoreSpi;
import java.security.Security;

import de.tsenger.androsmex.mrtd.DG11;
import de.tsenger.androsmex.mrtd.DG1_Dnie;
import de.tsenger.androsmex.mrtd.DG2;
import de.tsenger.androsmex.mrtd.DG7;
import de.tsenger.androsmex.mrtd.EF_COM;
import es.gob.jmulticard.jse.provider.DnieKeyStore;
import es.gob.jmulticard.jse.provider.MrtdKeyStoreImpl;
import es.gob.jmulticard.jse.provider.TcFnmtProvider;

/**
 * This class echoes a string called from JavaScript.
 */
public class DniScanner extends CordovaPlugin {


    //Etiqueta NFC
    private Tag tagFromIntent;
    //Adaptador NFC
    private NfcAdapter nfcAdapter;
    //Controlador de Intent
    private PendingIntent nfcPendingIntent;
    //Indica si ya se ha iniciado una tarea para evitar crear otro que solape
    public boolean usingNFC=false;
    //Indica si está habilitada la lectura de TAG's
    public boolean enableTag=false;
    //Valor del CAN introducido
    public String sCAN;

    public boolean isStarted = false;

    private JSONArray requestArgs;
    private CallbackContext callbackContext;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        this.callbackContext = callbackContext;
        this.requestArgs = args;

        if (action.equals("scanDNI")) {
            final CordovaPlugin that = this;
            isStarted = true;
            sCAN = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    Log.d("scan DNI NFC APP","comienza a leer");
                    checkNFC();
                    Log.d("scan DNI NFC APP","FINISH");
                }
            });

            return true;
        }
        else if(action.equals("resetUsingNFC")){
            usingNFC = false;
        }
        return false;
    }

    //Comprueba si el dispositivo tiene NFC y si está activado
    private void checkNFC(){

        nfcAdapter = NfcAdapter.getDefaultAdapter(cordova.getActivity());
        if (nfcAdapter == null) {
            Toast.makeText(cordova.getActivity(), "El dispositivo no tiene NFC", Toast.LENGTH_LONG).show();
        }else{
            if (!nfcAdapter.isEnabled()) {
                Toast.makeText(cordova.getActivity(), "Habilite el NFC", Toast.LENGTH_LONG).show();
            }else{
                Log.d("scan DNI NFC APP","Tiene el NFC activado y esta a la espera");
                nfcPendingIntent = PendingIntent.getActivity(cordova.getActivity(), 0, new Intent(cordova.getActivity(), cordova.getActivity().getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
                enableTagWriteMode();
            }
        }
    }
    //Habilita la lectura de TAG
    private void enableTagWriteMode() {
        enableTag=true;
        IntentFilter tagDetected = new IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED);
        IntentFilter[] mWriteTagFilters = new IntentFilter[] { tagDetected };
        //Al iniciar a veces salta una excepción
        Log.d("scan DNI NFC APP","Enable tag write mode");
        try{nfcAdapter.enableForegroundDispatch(cordova.getActivity(), nfcPendingIntent, mWriteTagFilters, null);}catch(Exception ex){Toast.makeText(cordova.getActivity(),ex.getMessage(), Toast.LENGTH_LONG).show();}
    }

    //Método que se ejecuta cuando se acerca el DNIe con NFC
    @Override
    public void onNewIntent(Intent intent) {
        String action = intent.getAction();
        if (NfcAdapter.ACTION_TAG_DISCOVERED.equals(action)) {
            //Si no se está usando ya el NFC
            if (!usingNFC) {
                //Recuperamos el TAG NFC del intent
                tagFromIntent = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
                Log.d("scan DNI NFC APP","New intentn -> "+sCAN);
                //CAN introducido por el usuario
                if(sCAN!=null && !"".equals(sCAN)) {
                    Toast.makeText(cordova.getActivity(), "Descargando datos, no separes el DNI", Toast.LENGTH_LONG).show();
                    //Lanzamos la tarea asíncrona que accede al DNIe
                    new DNIeAsyncTask().execute();
                }else{
                    Toast.makeText(cordova.getActivity(), "El CAN está vacio", Toast.LENGTH_LONG).show();
                    callbackContext.error("El CAN está vacio");
                }
            }
        }
    }


    //Tarea Asíncrona que accede al DNIe y recuepra los datos
    private class DNIeAsyncTask extends AsyncTask<Void, Float, String> {

        @Override
        protected void onPreExecute() {
            Log.d("scan DNI NFC APP","PreExecute");
        }

        @Override
        protected String doInBackground(Void...params) {
            //Resultado: JSON con los datos
            String result="";
            //Marcamos que el NFC está en uso
            usingNFC=true;
            try{
                //Propieadad para acceso rápido al DNIe
                System.setProperty("es.gob.jmulticard.fastmode", "true");

                //Instancia del Provider del DNIe
                final TcFnmtProvider p = new TcFnmtProvider();
                p.setProviderTag(tagFromIntent);
                p.setProviderCan(sCAN);
                Security.insertProviderAt(p, 1);


                //Instancia del almacén de certificados de DNIe
                KeyStoreSpi ksSpi = new MrtdKeyStoreImpl();
                DnieKeyStore m_ksUserMrtd = new DnieKeyStore(ksSpi, p, "TCFNMT");
                m_ksUserMrtd.load(null, null);

                //Diferentes capas de datos donde se guardan la información de la persona
                boolean m_existDg1 = false;
                boolean m_existDg2 = false;
                boolean m_existDg7 = false;
                boolean m_existDg11 = false;

                //Leemos el EF_COM para saber qué datos hay disponibles en el documento
                try {
                    EF_COM m_efcom = m_ksUserMrtd.getEFCOM();
                    byte[] tagList = m_efcom.getTagList();

                    for (int idx = 0; idx < tagList.length; idx++) {
                        switch (tagList[idx]) {
                            case 0x61:
                                // DG_1.
                                m_existDg1 = true;
                                break;
                            case 0x75:
                                // DG_2.
                                m_existDg2 = true;
                                break;
                            case 0x67:
                                // DG_7.
                                m_existDg7 = true;
                                break;
                            case 0x6B:
                                // DG_11.
                                m_existDg11 = true;
                                break;
                        }
                    }

                } catch (Exception ex) {

                }

                //Grupos de datos de cada capa
                DG1_Dnie m_dg1 = null;
                DG11 m_dg11 = null;
                DG2 m_dg2 = null;
                DG7 m_dg7 = null;

                //Si existe la Capa 1, accedemos al grupo de datos que tiene
                try {
                    if (m_existDg1)
                        m_dg1 = m_ksUserMrtd.getDatagroup1();
                } catch (Exception ex) {
                    Log.d("scan DNI NFC APP","Error al leer los datos de la capa: 11"+ex.getMessage());
                    Toast.makeText(cordova.getActivity(), "Error al leer los datos de la capa: 11"+ex.getMessage(), Toast.LENGTH_LONG).show();
                }
                //Si existe la Capa 11, accedemos al grupo de datos que tiene
                try {
                    if (m_existDg11)
                        m_dg11 = m_ksUserMrtd.getDatagroup11();
                } catch (Exception ex) {
                    Log.d("scan DNI NFC APP","Error al leer los datos de la capa: 11"+ex.getMessage());
                    Toast.makeText(cordova.getActivity(), "Error al leer los datos de la capa: 11"+ex.getMessage(), Toast.LENGTH_LONG).show();
                }
                //Si existe la Capa 2, accedemos al grupo de datos que tiene
                if(m_existDg2)
                {
                    try{
                        m_dg2 = m_ksUserMrtd.getDatagroup2();

                    }catch (Exception ex)
                    {
                        Log.d("scan DNI NFC APP","Error al leer la imagen del ciudadano: "+ex.getMessage());
                        Toast.makeText(cordova.getActivity(), "Error al leer la imagen del ciudadano: "+ex.getMessage(), Toast.LENGTH_LONG).show();
                    }
                }

                //Objeto que almacena los datos
                DNIeInformation aDNIeInformation = new DNIeInformation();
                //Recuperamos los datos de la capa 1
                if(m_dg1!=null) {
                    try {
                        aDNIeInformation.Name = m_dg1.getName();
                        aDNIeInformation.Surname = m_dg1.getSurname();
                        aDNIeInformation.DniNumber = m_dg1.getDocNumber();
                        aDNIeInformation.DateOfBirth = m_dg1.getDateOfBirth();
                        aDNIeInformation.DateOfExpiry = m_dg1.getDateOfExpiry();
                        aDNIeInformation.Nationality = m_dg1.getNationality();
                        aDNIeInformation.Sex = m_dg1.getSex();
                    }catch(Exception ex){}
                }
                //Recuperamos los datos de la capa 2
                if(m_dg2!=null) {
                   try {
                        // Parseo de la foto en formato JPEG-2000
                        byte [] aImage = m_dg2.getImageBytes();
                        J2kStreamDecoder aJ2K = new J2kStreamDecoder();
                        ByteArrayInputStream aIn = new ByteArrayInputStream(aImage);
                        Bitmap aBMP = aJ2K.decode(aIn);
                        ByteArrayOutputStream aOut = new ByteArrayOutputStream();
                        aBMP.compress(Bitmap.CompressFormat.PNG, 100, aOut);
                        byte[] bPhoto = aOut.toByteArray();
                        aDNIeInformation.PhotoB64 = Base64.encodeToString(bPhoto, Base64.NO_WRAP);
                    }catch (Exception ex){}
                }
                //Recuperamos los datos de la capa 11
                if(m_dg11!=null) {
                    try{
                        aDNIeInformation.BirthPlace = m_dg11.getBirthPlace();
                        aDNIeInformation.Address = m_dg11.getAddress(DG11.ADDR_DIRECCION);
                        aDNIeInformation.City = m_dg11.getAddress(DG11.ADDR_LOCALIDAD);
                        aDNIeInformation.Province = m_dg11.getAddress(DG11.ADDR_PROVINCIA);
                        aDNIeInformation.DniNumber = m_dg11.getPersonalNumber();
                        aDNIeInformation.Phone =  m_dg11.getPhone();
                    }catch(Exception ex){}
                }

                //El ToString ya está prepadao para generar el JSON
                result = aDNIeInformation.toString();


            }catch(Exception ex)
            {
                result = ex.getMessage();
                usingNFC = false;
                callbackContext.error(result);
                return "";
            }
            return result;
        }

        @Override
        protected void onProgressUpdate (Float... values) {
            super.onProgressUpdate(values);
            Log.d("scan DNI NFC APP","progress update "+ String.valueOf(values[0]) );
        }

        @Override
        protected void onPostExecute(String result) {
            if(result != ""){
                usingNFC = false;
                PluginResult resultPlugin;
                resultPlugin = new PluginResult(PluginResult.Status.OK,result);
                isStarted = false;
                Log.d("scan DNI NFC APP","RESULT TRUE y todo way" );
                callbackContext.success(result);
                nfcPendingIntent.cancel();
            }
        }

    }

}
