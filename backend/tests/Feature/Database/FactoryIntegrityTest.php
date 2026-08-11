<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

test('all factories can create models', function () {
    // Get all factory files
    $factoryFiles = File::files(database_path('factories'));
    
    foreach ($factoryFiles as $file) {
        $className = 'Database\\Factories\\' . $file->getFilenameWithoutExtension();
        
        if (class_exists($className)) {
            $factory = app($className);
            $modelClass = $factory->modelName();
            
            // Try to create the model using the factory
            $model = $modelClass::factory()->create();
            
            $this->assertNotNull($model->id, "Factory {$className} failed to create a valid model with an ID.");
        }
    }
});
