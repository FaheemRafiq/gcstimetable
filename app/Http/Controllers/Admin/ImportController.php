<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\PermissionEnum;
use App\Services\ImportService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ImportController extends Controller
{
    protected ImportService $importService;

    public function __construct(ImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Show the import form.
     */
    public function index()
    {
        $admin = Auth::user();

        if ($admin->can(PermissionEnum::VIEW_IMPORT) === false) {
            abort(403);
        }

        return Inertia::render('Admin/Import/index', [
            'export_tables' => array_keys($this->importService->exports),
            'import_tables' => array_keys($this->importService->imports),
        ]);
    }

    /**
     * Handle file import.
     */
    public function store(Request $request)
    {
        $admin = Auth::user();

        if ($admin->can(PermissionEnum::IMPORT_DATA) === false) {
            return back()->with('error', config('providers.permission.action.error'));
        }

        $request->validate([
            'file'  => 'required|file|mimes:xlsx,xls',
            'table' => 'required|in:'.implode(',', array_keys($this->importService->imports)),
        ]);

        $result = $this->importService->import($request->table, $request->file('file'));

        return isset($result['error'])
            ? redirect()->back()->withErrors(['file' => $result['error']])
            : back()->with('success', $result['success']);
    }

    /**
     * Export a template for a table.
     */
    public function exportTemplate(Request $request)
    {
        $admin = Auth::user();

        if ($admin->can(PermissionEnum::EXPORT_TEMPLATE) === false) {
            return back()->with('error', config('providers.permission.action.error'));
        }

        $request->validate([
            'table' => 'required|string|in:'.implode(',', array_keys($this->importService->exports)),
        ]);

        return $this->importService->exportTemplate($request->table, $request->input('numberRows'));
    }
}
