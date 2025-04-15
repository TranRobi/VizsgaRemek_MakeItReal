/*
 * OpenAPI schema leírások
 */

export const SWAGGER_SCHEMAS = {
	login_response: {
		type: "object",
		properties: {
			id: {
				type: "number",
				description: "Felhasználó ID-je",
			},
			token: {
				type: "string",
				description: "LOGIN_TOKEN Swagger miatt itt is elküldve",
			},
		},
	},
	product_post_request: {
		type: "object",
		properties: {
			name: {
				type: "string",
				description: "Termék neve",
				example: "Torment Nexus",
			},
			description: {
				type: "string",
				description: "Termék leírása",
				example:
					"We built the Torment Nexus from the sci-fi novel Do not build the Torment Nexus",
			},
			"stl-file": {
				type: "string",
				format: "binary",
			},
		},
		encoding: {
			"stl-file": {
				contentType: [
					"model/stl",
					"application/vnd.ms-pki.stl",
					"model/x.stl-ascii model/x.stl-binary",
				],
			},
		},
	},
	product_request: {
		type: "object",
		properties: {
			name: {
				type: "string",
				description: "Termék neve",
				example: "Torment Nexus",
			},
			description: {
				type: "string",
				description: "Termék leírása",
				example:
					"We built the Torment Nexus from the sci-fi novel Do not build the Torment Nexus",
			},
		},
	},
	product_response: {
		type: "object",
		properties: {
			id: {
				type: "integer",
				description: "Termék ID",
			},
			uploader_id: {
				type: "integer",
				description: "Feltöltő ID-je",
			},
			name: {
				type: "string",
				description: "Termék neve",
			},
			description: {
				type: "string",
				description: "Termék leírása",
			},
		},
	},
	order_history_element: {
		type: "object",
		properties: {
			id: {
				type: "integer",
				description: "Termék ID",
			},
			uploader_id: {
				type: "integer",
				description: "Feltöltő ID-je",
			},
			name: {
				type: "string",
				description: "Termék neve",
			},
			description: {
				type: "string",
				description: "Termék leírása",
			},
            cost_per_piece: {
				type: "integer",
				description: "Darabár",
            },
		},
	},
    order_history_response: {
        type: 'array',
        items: {
            '$ref': '#/components/schemas/order_history_element',
        },
    },
	delivery_information_request: {
		type: "object",
		properties: {
			country: {
				type: "string",
				description: "Ország",
				example: "Csád",
			},
			county: {
				type: "string",
				description: "Megye/Állam",
				example: "Kanto",
			},
			city: {
				type: "string",
				description: "Város",
				example: "Shenzen",
			},
			'postal-code': {
				type: "number",
				description: "Irányítószám",
				example: "6666",
			},
			"street-number": {
				type: "string",
				description: "Utca, házszám, emelet, ajtó, stb.",
				example: "308 Negra Arroyo Lane",
			},
			"phone-number": {
				type: "string",
				description: "Telefonszám",
				example: "+36701234567",
			},
			name: {
				type: "string",
				description: "Számlázási név",
				example: "John Buyer",
			},
		},
	},
    payment_information_request: {
        type: 'object',
        properties: {
            'card-number': {
                type: 'string',
                description: 'Kártyaszám',
                example: '1234567890123456789',
            },
            'cvv': {
                type: 'string',
                description: 'CVV',
                example: '666',
            },
            'expiration-date': {
                type: 'string',
                description: 'Lejárati dátum (MM/YY)',
                example: '03/28',
            },
        },
    },
    order_product_info: {
        type: 'object',
        properties: {
            id: {
                type: 'number',
                description: 'Termék ID',
                example: 1,
            },
            quantity: {
                type: 'number',
                description: 'Mennyiség',
                example: 69,
            },
            material: {
                type: 'string',
                description: 'Anyag',
                example: 'PLA',
            },
            colour: {
                type: 'string',
                description: 'Szín',
                example: 'Blue',
            },
        },
        required: [
            'quantity',
            'material',
            'colour',
        ],
    },
    order_request: {
        type: 'object',
        properties: {
			country: {
				type: "string",
				description: "Ország",
				example: "Csád",
			},
			county: {
				type: "string",
				description: "Megye/Állam",
				example: "Kanto",
			},
			city: {
				type: "string",
				description: "Város",
				example: "Shenzen",
			},
			'postal-code': {
				type: "number",
				description: "Irányítószám",
				example: "6666",
			},
			"street-number": {
				type: "string",
				description: "Utca, házszám, emelet, ajtó, stb.",
				example: "308 Negra Arroyo Lane",
			},
			"phone-number": {
				type: "string",
				description: "Telefonszám",
				example: "+36701234567",
			},
			name: {
				type: "string",
				description: "Számlázási név",
				example: "John Buyer",
			},
            'card-number': {
                type: 'string',
                description: 'Kártyaszám',
                example: '1234567890123456789',
            },
            'cvv': {
                type: 'string',
                description: 'CVV',
                example: '666',
            },
            'expiration-date': {
                type: 'string',
                description: 'Lejárati dátum (MM/YY)',
                example: '03/28',
            },
            'email-address': {
                type: 'string',
                description: 'E-mail cím',
                example: 'mernok@homestead.moe',
            },
            products: {
                type: 'array',
                items: {
                    '$ref': '#/components/schemas/order_product_info',
                },
            },
        },
    },
	order_response: {
		type: 'object',
		properties: {
			'card-number': {
				type: 'string',
                description: 'Kártyaszám',
                example: '1234567890123456789',
			},
            name: {
				type: 'string',
                description: 'Rendelő neve',
                example: 'Gipsz Jakab',
			},
            cvv: {
				type: 'string',
                description: 'CVV kártyaszám',
                example: '666',
			},
            'expiration-date': {
				type: 'string',
                description: '03/28',
                example: 'Bankkártya lejárati dátuma',
			},
            country: {
				type: 'string',
                description: 'Cím ország része',
                example: 'Csád',
			},
            county: {
				type: 'string',
                description: 'Cím megye/állam része',
                example: 'Kanto',
			},
            city: {
				type: 'string',
                description: 'Cím város része',
                example: 'Belgrád',
			},
            'postal-code': {
				type: 'string',
                description: 'Cím irányítószám része',
                example: '6666',
			},
            'street-number': {
				type: 'string',
                description: 'Cím utca+házszám része',
                example: '308 Negra Arroyo Lane',
			},
            'phone-number': {
				type: 'string',
                description: 'Telefonszám (szállításhoz)',
                example: '+36701234567',
			},
            'product-id': {
				type: 'integer',
                description: 'Termék azonosító (null, ha egyedi rendelésst kap a backend)',
                example: 2,
			},
            'email-address': {
				type: 'string',
                description: 'E-mail cím',
                example: 'mernok@homestead.moe',
			},
            quantity: {
				type: 'integer',
                description: 'Rendelt mennyiség',
                example: 5,
			},
            material: {
				type: 'string',
                description: 'Anyag',
                example: 'ABS',
			},
            colour: {
				type: 'string',
                description: 'Szín',
                example: 'Red',
			},
            state: {
				type: 'string',
                description: 'Rendelés feldolgozásának állapota',
                example: 'pending',
			},
            'price-per-product': {
				type: 'integer',
                description: 'Termék darabonkénti ára',
                example: 1000,
			},
            'total-price': {
				type: 'integer',
                description: 'Összár',
                example: 10000,
			},
		},
	},
    custom_order_request: {
        type: 'object',
        properties: {
            quantity: {
                type: 'number',
                description: 'Mennyiség',
                example: 69,
            },
            material: {
                type: 'string',
                description: 'Anyag',
                example: 'PLA',
            },
            colour: {
                type: 'string',
                description: 'Szín',
                example: 'Blue',
            },
			country: {
				type: "string",
				description: "Ország",
				example: "Csád",
			},
			county: {
				type: "string",
				description: "Megye/Állam",
				example: "Kanto",
			},
			city: {
				type: "string",
				description: "Város",
				example: "Shenzen",
			},
			'postal-code': {
				type: "number",
				description: "Irányítószám",
				example: "6666",
			},
			"street-number": {
				type: "string",
				description: "Utca, házszám, emelet, ajtó, stb.",
				example: "308 Negra Arroyo Lane",
			},
			"phone-number": {
				type: "string",
				description: "Telefonszám",
				example: "+36701234567",
			},
			name: {
				type: "string",
				description: "Számlázási név",
				example: "John Buyer",
			},
            'card-number': {
                type: 'string',
                description: 'Kártyaszám',
                example: '1234567890123456789',
            },
            'cvv': {
                type: 'string',
                description: 'CVV',
                example: '666',
            },
            'expiration-date': {
                type: 'string',
                description: 'Lejárati dátum (MM/YY)',
                example: '03/28',
            },
            'email-address': {
                type: 'string',
                description: 'E-mail cím',
                example: 'mernok@homestead.moe',
            },
			"stl-file": {
				type: "string",
				format: "binary",
			},
		},
		encoding: {
			"stl-file": {
				contentType: [
					"model/stl",
					"application/vnd.ms-pki.stl",
					"model/x.stl-ascii model/x.stl-binary",
				],
			},
		},
    },
	checkout_response: {
		type: "object",
		properties: {
			id: {
				type: 'number',
				description: 'Termék ID',
				example: 1,
			},
			price: {
				type: 'number',
				description: 'Termék ára',
				example: 1000,
			},
		},
	},
};

export default SWAGGER_SCHEMAS;
