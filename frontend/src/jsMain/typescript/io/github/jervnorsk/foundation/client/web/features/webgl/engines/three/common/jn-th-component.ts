import {AfterViewInit, OnInit} from "@angular/core";

export interface JnThComponent extends OnInit, AfterViewInit {

    thOnInitDOM(): void;
}
