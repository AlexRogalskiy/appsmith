import { Diff } from "deep-diff";
import { Action } from "entities/Action";
import ReplayEntity from "..";
import { pathArrayToString } from "../replayUtils";
import { JSActionConfig } from "entities/JSCollection";
import { Datasource } from "entities/Datasource";
import { ENTITY_TYPE } from "entities/AppsmithConsole";

/*
 This type represents all the form objects that can be undone/redone. 
 (Action, datasource, jsAction etc)
*/
export type ReplayEditorType =
  | Partial<JSActionConfig>
  | Partial<Datasource>
  | Partial<Action>;

type ReplayEditorDiff = Diff<ReplayEditorType, ReplayEditorType>;

export type ReplayEditorUpdate = {
  modifiedProperty: string;
  index?: number;
  update: ReplayEditorType | ReplayEditorDiff;
  kind: "N" | "D" | "E" | "A";
  isUndo?: boolean;
};
export default class ReplayEditor extends ReplayEntity<ReplayEditorType> {
  constructor(entity: ReplayEditorType, entityType: ENTITY_TYPE) {
    super(entity, entityType);
  }

  public processDiff(
    diff: Diff<ReplayEditorType, ReplayEditorType>,
    replay: any,
    isUndo: boolean,
  ): void {
    if (!diff || !diff.path || !diff.path.length) return;
    replay.updates = (replay.updates || []).concat(
      this.getChanges(diff, isUndo) || [],
    );
  }

  /*
    The should get us the modified property (configProperty from editor, settings and form json files), the updated value and the kind of update.
    The modifiedProperty would be used to highlight the field that has been replayed. We might need to use the kind in future to display toast
    messages or even highlight based on the kind.
  */
  private getChanges(
    diff: Diff<ReplayEditorType, ReplayEditorType>,
    isUndo: boolean,
  ): ReplayEditorUpdate | undefined {
    const { kind, path } = diff;
    if (diff.kind === "N") {
      return {
        modifiedProperty: pathArrayToString(path),
        update: diff.rhs,
        kind,
      };
    } else if (diff.kind === "A") {
      return {
        modifiedProperty: pathArrayToString(path),
        update: diff.item,
        index: diff.index,
        kind,
        isUndo,
      };
    } else if (diff.kind === "E") {
      if (diff.lhs === diff.rhs) return;
      return {
        modifiedProperty: pathArrayToString(path),
        update: isUndo ? diff.lhs : diff.rhs,
        kind,
      };
    }
    return {
      modifiedProperty: pathArrayToString(path),
      update: diff.lhs,
      kind,
    };
  }
}
