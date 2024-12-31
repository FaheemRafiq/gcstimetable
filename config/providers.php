<?php


return [
    'date' => [
        'format'    => 'd M Y',
        'datetime'  => 'Y-m-d H:i:s',
        'time'      => 'H:i:s',
        'timezone'  => 'UTC',
        'readable'  => 'd M Y h:i a',
    ],

    'pagination' => [
        'per_page' => 15,
    ],

    'permission' => [
        'action' => [
            'error' => [
                "You do not have permission to perform this action."
            ]
        ],
        'view' => [
            'error' => [
                "You do not have permission to view this resource."
            ]
        ]
    ]
];
