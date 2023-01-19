<?php
if (isUserLoggedIn()):
    $idUser = $_SESSION["idUser"];
    $allRecipes[0] = $dbh->getSavedRecipes($idUser);
    $allRecipes[1] = $dbh->getUserRecipes($idUser); ?>
    
    <!-- tabs -->
    <ul>
    <?php foreach($allRecipes as $recipes): ?>
        <li></li>
    <?php endforeach; ?>
    </ul>
    <!-- containers -->
    <?php foreach($allRecipes as $recipes): ?>
    <div>
    <?php if(empty($recipes)):
        ?>
        <h2>No saved recipes</h2>
    <?php else: ?>
        <section id="comments" class="container mt-5 mb-5 col-12 col-md-10 col-lg-8">
        <?php foreach($recipes as $recipe): ?>
            <!--visualizzazione titolo ricetta-->
            <div id=<?php echo "Post{$recipe["IDpost"]}"; ?> class="row mt-2">
                <div class="d-flex col-1" style="max-width: 60px; min-width: 50px;">
                    <img src="img/recipe-icon.png" style="max-width: 40px; max-height: 40px; margin-top: 10px;">
                </div>
                <div class="d-flex flex-column col-10 col-lg-11">
                    <span class="fw-bold">
                        <?php echo "{$recipe["title"]}"; ?>
                    </span>
                    <span>
                        <?php echo "by {$recipe["username"]}"; ?>
                    </span>
                    <div class="d-flex">
                        <a class="btn btn-primary" style="max-height: 40px;" data-bs-toggle="collapse" href="#more<?php echo "{$recipe["IDpost"]}"; ?>" role="button" aria-expanded="false" aria-controls="more<?php echo "{$recipe["IDpost"]}"; ?>">
                            See ▼
                        </a>
                    </div>
                </div>
                <!--visualizzazione dettagli ricetta-->
                <div class="offset-1 collapse" id="more<?php echo "{$recipe["IDpost"]}"; ?>">
                    <!--ingredienti-->
                    <div id="<?php echo "Ingredients{$recipe["IDrecipe"]}"; ?>ingredients" class="row mt-2">
                        <div class="d-flex flex-column col-10">
                            <span class="fw-bold">
                                INGREDIENTS
                            </span>
                            <span>
                                <ul>
                                <?php foreach(json_decode($recipe["ingredients"], true) as $ing => $q) {
                                    echo "<li>".$ing.": ".$q."</li>";
                                }?>
                                </ul>
                            </span>
                        </div>
                    </div>
                    <!--procedura-->
                    <div id="<?php echo "Method{$recipe["IDrecipe"]}"; ?>method" class="row mt-2">
                        <div class="d-flex flex-column col-10">
                            <span class="fw-bold">
                                METHOD
                            </span>
                            <span>
                                <?php echo "{$recipe["method"]}"; ?>
                            </span>
                        </div>
                    </div>
                    <!-- Pulsanti "Usa" ed "Elimina" -->
                    <button type="button" alt="Use recipe" id="UseRecipe-button<?php echo $recipe['IDpost']; ?>" onclick="useRecipe(<?php echo $recipe['IDrecipe']; ?>)">Use</button>
                    <button type="button" alt="Delete recipe" id="DeleteRecipe-button<?php echo $recipe['IDpost']; ?>" onclick="deleteRecipe(<?php echo $recipe['IDpost']; ?>)">Delete</button>
                </div>

            </div>
        <?php endforeach;?>
        </section>
    <?php endif;?>
    </div>
    <?php endforeach; ?>
<?php endif;?>