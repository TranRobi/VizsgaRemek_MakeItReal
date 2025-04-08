export const validate_delivery_information = (
    country,
    county,
    city,
    postal_code,
    street_number,
    phone_number,
    name
) =>
	!(
        !country ||
	    !county ||
	    !city ||
	    !postal_code ||
	    !street_number ||
	    !phone_number ||
	    !name ||
	    phone_number.length > 12 ||
	    country.length > 64 ||
	    county.length > 128 ||
	    city.length > 128 ||
	    street_number.length > 128 ||
	    name.length > 64 ||
	    postal_code < 1
    )
;
