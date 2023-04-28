import {AfterContentInit, AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {BufferGeometry, Mesh, MeshBasicMaterial, Scene, SphereGeometry, Vector3} from "three";
import {ThScene} from "ngx-three";

@Component({
    selector: 'th-prefab-grid',
    templateUrl: './th-prefab-grid.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThPrefabGrid implements OnInit {

    scene: Scene | undefined

    constructor(
        private thScene: ThScene
    ) {
        thScene.objRef$.subscribe(it => {
            this.scene = it;
        });
    }

    @Input()
    set position(value: Vector3 | [x: number, y: number, z: number]) {
        if(value instanceof Vector3) {
            this.config.unit.position.set(
                value.x,
                value.y,
                value.z
            );
        }
        else {
            this.config.unit.position.set(
                value[0],
                value[1],
                value[2],
            );
        }
    }

    @Input()
    set padding(value: number) {
        this.config.unit.padding = value
    }

    @Input()
    set size(value: [x: number, y:number]) {
        this.config.size.x = value[0];
        this.config.size.y = value[1];
    }

    private config = {
        unit: {
            geometry: new SphereGeometry(),
            material: new MeshBasicMaterial(),
            position: new Vector3(0, 0,0),
            radius: 0.01,
            padding: 0.5
        },
        size: {
            x: 10,
            y: 10
        }
    }

    ngOnInit() {
        this.initGrid(this.config);

        // this.enableDebugging();
    }

    initGrid(config: {
        unit: {
            geometry: SphereGeometry,
            material: MeshBasicMaterial,
            position: Vector3,
            radius: number
            padding: number
        },
        size: {
            x: number,
            y: number
        }
    }) {
        let unit = {
            geometry: new SphereGeometry(1, 4, 2),
            material: new MeshBasicMaterial(),
            scale: new Vector3(
                config.unit.radius,
                config.unit.radius,
                config.unit.radius,
            ),
            position: config.unit.position
        }
        let quadrants = {
            one: {
                rows: {
                    count: config.size.y,
                    startFrom: 0,
                    offset: config.unit.padding
                },
                columns: {
                    count: config.size.x,
                    startFrom: 0,
                    offset: config.unit.padding
                }
            },
            two: {
                rows: {
                    count: config.size.y,
                    startFrom: 0,
                    offset: config.unit.padding
                },
                columns: {
                    count: config.size.x - 1,
                    startFrom: 1,
                    offset: config.unit.padding * -1
                }
            },
            three: {
                rows: {
                    count: config.size.y - 1,
                    startFrom: 1,
                    offset: config.unit.padding * -1
                },
                columns: {
                    count: config.size.x - 1,
                    startFrom: 1,
                    offset: config.unit.padding * -1
                }
            },
            four: {
                rows: {
                    count: config.size.y - 1,
                    startFrom: 1,
                    offset: config.unit.padding * -1
                },
                columns: {
                    count: config.size.x,
                    startFrom: 0,
                    offset: config.unit.padding
                }
            }
        }

        this.initGridQuadrant({unit, quadrant: quadrants.one})
        this.initGridQuadrant({unit, quadrant: quadrants.two})
        this.initGridQuadrant({unit, quadrant: quadrants.three})
        this.initGridQuadrant({unit, quadrant: quadrants.four})

        // console.log(this.scene.children);
    }

    initGridQuadrant(config: {
        unit: {
            geometry: BufferGeometry,
            material: MeshBasicMaterial
            scale: Vector3
            position: Vector3
        },
        quadrant: {
            rows: {
                count: number,
                startFrom: number
                offset: number
            },
            columns: {
                count: number,
                startFrom: number,
                offset: number
            }
        }
    }) {
        for (let rowIndex = config.quadrant.rows.startFrom;
             rowIndex < config.quadrant.rows.startFrom + config.quadrant.rows.count;
             rowIndex++
        ) {
            for (let columnIndex = config.quadrant.columns.startFrom;
                 columnIndex < config.quadrant.columns.startFrom + config.quadrant.columns.count;
                 columnIndex++
            ) {
                let unit = new Mesh(config.unit.geometry, config.unit.material);

                unit.scale.set(
                    config.unit.scale.x,
                    config.unit.scale.y,
                    config.unit.scale.z,
                )
                unit.position.set(
                    config.unit.position.x + (config.quadrant.columns.offset * columnIndex),
                    config.unit.position.y,
                    config.unit.position.z + (config.quadrant.rows.offset * rowIndex),
                );

                this.scene?.children.push(unit);
            }
        }
    }

    enableDebugging() {
        let controller = {
            mesh: new Mesh(
                new SphereGeometry(0.1, 4, 2),
                new MeshBasicMaterial({
                    color: 'red'
                })
            )
        }

        this.scene?.children.push(controller.mesh)
    }
}
