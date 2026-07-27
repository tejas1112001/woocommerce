Ivenoryinvenory_quanty"

#tep 2Get egins
Wite-Hs "2 Fetching ego..Yellow
$gionsRspose=Invoke-RestMethod-U "$backendUrl/sor/regions" eader@{x-publishable-api-key"=$publishableKey}
$regionId=$regiosRspose.regins[0].id
Wite-Host "   RegioneginsResnseegome"

#Step3:Cretaca
Wite-Hs "3 Ceig  w car...Yllow$rBody =@region_id = $regionId} | ConvertTo-Json$cartResponse=Invoke-RestMethod-U "$backendUrl/store/cars" -Mthod POST eader@{"x-publishable-api-key=$publishableKey;"Cntn-Type" = "appliaton/jso"} -Body$catBy
$arId =artRsse.cartid
Writ-Hot "   Cart ID: $crtIdGrn4 Additm ocat4Addpoduct t cart$lineIemBod =@variant_id=vaantId; quantity = 1} | CvertTo-Jon
$lineItemcats/$cartId/le-itemMethod POST -;"Ctt-Typ" = "applcati/jon"}BoylItmBody
Wte-H"SUCCESS!Productaddedtocart"-ForuColorGItms cartleItemcat.temCutWrit-Hot""
#Step5:Verifycart
5.Vrfyigcart ctents...Yllow$vrfyCar=Invoke-RestMethod-Uri"$backendUrl/store/rs/$artId" -Headers @{"x-publisable-api-key" =$publishableKey} Totalitems:$($veiyCar.art.tems.Cout)" -ForeroundColorGen
Wrte-Ht "   SubtotalverifyCartarubtotlor Green
Write-Hst ""

Wite-Host "========================================"-ForgrounColor CyanWrite-Host "Test Complete - AddtoCartWORKS!"-ForgroundColorGreen======================================== -ForegroundColor Cyan